#!/usr/bin/env python
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "adams_backend.settings")
    if len(sys.argv) > 1 and sys.argv[1] == "runserver":
        has_addrport = any(arg for arg in sys.argv[2:] if not arg.startswith("-"))
        if not has_addrport:
            sys.argv.insert(2, os.getenv("DJANGO_RUNSERVER_ADDR", "0.0.0.0:8000"))
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and available on your PYTHONPATH?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
