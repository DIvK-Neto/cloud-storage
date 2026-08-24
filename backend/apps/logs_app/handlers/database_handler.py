import logging


class DatabaseLogHandler(logging.Handler):
    def emit(self, record):
        try:
            from apps.logs_app.model_definitions.all_models import AppLogEntry
            AppLogEntry.objects.create(
                level=record.levelname,
                module=record.name,
                message=record.getMessage(),
                user=None,
                ip=None,
                category='general'
            )
        except Exception:
            pass
