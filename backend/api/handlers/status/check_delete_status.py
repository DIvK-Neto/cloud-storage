from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import File, Folder, ShareLink, SharedCollection


class CheckDeleteStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items = request.data.get('items', [])
        if not items:
            return Response({"error": "Нет элементов для проверки"}, status=400)

        result = []
        for item in items:
            item_id = item.get('id')
            item_type = item.get('type')
            if not item_id or not item_type:
                continue

            try:
                if item_type == 'file':
                    obj = File.objects.get(id=item_id, user=request.user)
                elif item_type == 'folder':
                    obj = Folder.objects.get(id=item_id, user=request.user)
                else:
                    continue
            except (File.DoesNotExist, Folder.DoesNotExist):
                result.append({
                    "id": item_id,
                    "type": item_type,
                    "status": "error",
                    "reason": "Элемент не найден",
                    "hasLinks": False,
                    "collections": []
                })
                continue

            # Проверка одиночных ссылок
            has_links = False
            if item_type == 'file':
                has_links = ShareLink.objects.filter(file=obj).exists()
            elif item_type == 'folder':
                has_links = ShareLink.objects.filter(folder=obj).exists()
                if not has_links:
                    # Проверяем файлы внутри папки
                    for f in File.objects.filter(folder=obj):
                        if ShareLink.objects.filter(file=f).exists():
                            has_links = True
                            break
                    if not has_links:
                        for sub in Folder.objects.filter(parent=obj):
                            if ShareLink.objects.filter(folder=sub).exists():
                                has_links = True
                                break

            # Проверка коллекций
            collection_names = []
            if item_type == 'file':
                collections = SharedCollection.objects.filter(files=obj)
                collection_names = list(
                    collections.values_list('name', flat=True))
            elif item_type == 'folder':
                collections = SharedCollection.objects.filter(folders=obj)
                collection_names = list(
                    collections.values_list('name', flat=True))
                if not collection_names:
                    # Проверяем файлы внутри папки
                    for f in File.objects.filter(folder=obj):
                        cols = SharedCollection.objects.filter(files=f)
                        if cols.exists():
                            collection_names.extend(
                                cols.values_list('name', flat=True))
                            break
                    if not collection_names:
                        for sub in Folder.objects.filter(parent=obj):
                            cols = SharedCollection.objects.filter(folders=sub)
                            if cols.exists():
                                collection_names.extend(
                                    cols.values_list('name', flat=True))
                                break

            # Определяем статус
            if has_links or collection_names:
                status = 'warning'
                reason_parts = []
                if has_links:
                    reason_parts.append('есть одиночные ссылки')
                if collection_names:
                    reason_parts.append('используется в коллекциях')
                reason = f"Элемент имеет: {', '.join(reason_parts)}. При удалении ссылки и коллекции будут удалены автоматически."
                result.append({
                    "id": item_id,
                    "type": item_type,
                    "status": status,
                    "reason": reason,
                    "hasLinks": has_links,
                    "collections": collection_names
                })
            else:
                result.append({
                    "id": item_id,
                    "type": item_type,
                    "status": "success",
                    "reason": "Готов к удалению",
                    "hasLinks": False,
                    "collections": []
                })

        return Response({"items": result})
