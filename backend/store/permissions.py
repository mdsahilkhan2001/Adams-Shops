import os

import jwt
from django.contrib.auth import get_user_model
from django.db import OperationalError, ProgrammingError, transaction
from django.utils.text import slugify
from rest_framework import authentication, permissions
from rest_framework.exceptions import AuthenticationFailed

from .models import UserRole

User = get_user_model()


class NodeAccessTokenAuthentication(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).decode("utf-8")
        if not auth_header or not auth_header.lower().startswith(f"{self.keyword.lower()} "):
            return None

        token = auth_header.split(" ", 1)[1].strip()
        secret = os.getenv("ACCESS_TOKEN_SECRET", "dev_access_secret")

        try:
            payload = jwt.decode(token, secret, algorithms=["HS256"])
        except jwt.ExpiredSignatureError as exc:
            raise AuthenticationFailed("Token expired.") from exc
        except jwt.InvalidTokenError as exc:
            raise AuthenticationFailed("Invalid token.") from exc

        email = str(payload.get("email") or "").strip().lower()
        if not email:
            raise AuthenticationFailed("Token missing email.")

        role = str(payload.get("role") or "customer").strip().lower()
        is_admin = role in {"admin", "superadmin", "super_admin"}
        mapped_role = "super_admin" if role in {"superadmin", "super_admin"} else ("admin" if is_admin else "customer")

        with transaction.atomic():
            user = User.objects.filter(email=email).first()
            if not user:
                base_username = slugify(email.split("@", 1)[0]) or "user"
                username = base_username
                suffix = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}-{suffix}"
                    suffix += 1

                user = User.objects.create(
                    username=username,
                    email=email,
                    is_active=True,
                    is_staff=is_admin,
                    is_superuser=role in {"superadmin", "super_admin"}
                )
                user.set_unusable_password()
                user.save(update_fields=["password"])
            else:
                updates = []
                if not user.username:
                    base_username = slugify(email.split("@", 1)[0]) or "user"
                    username = base_username
                    suffix = 1
                    while User.objects.filter(username=username).exclude(pk=user.pk).exists():
                        username = f"{base_username}-{suffix}"
                        suffix += 1
                    user.username = username
                    updates.append("username")

                if user.is_staff != is_admin:
                    user.is_staff = is_admin
                    updates.append("is_staff")

                is_superuser = role in {"superadmin", "super_admin"}
                if user.is_superuser != is_superuser:
                    user.is_superuser = is_superuser
                    updates.append("is_superuser")

                if updates:
                    user.save(update_fields=updates)

        try:
            user_role, created = UserRole.objects.get_or_create(user=user, defaults={"role": mapped_role})
            if not created and user_role.role != mapped_role:
                user_role.role = mapped_role
                user_role.save(update_fields=["role", "updated_at"])
        except (OperationalError, ProgrammingError):
            # Some local databases may not have the legacy role table yet.
            # Authentication should still work so the admin UI can load.
            pass

        return (user, token)


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
