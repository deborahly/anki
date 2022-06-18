from django.contrib import admin
from .models import BasicCard, CardDeck, User

class CardDeckAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')

# Register your models here.
admin.site.register(User)
admin.site.register(CardDeck, CardDeckAdmin)
admin.site.register(BasicCard)