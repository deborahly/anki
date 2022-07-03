from django.contrib import admin
from .models import BasicCard, CardDeck, User

class CardDeckAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user')
    list_filter = ('user',)

class BasicCardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'grammar_class', 'easiness', 'front', 'front_extra', 'back_main', 'back_alt_1', 'back_alt_2', 'deck', 'updated_at')
    list_filter = ('user', 'deck', 'updated_at',)

# Register your models here.
admin.site.register(User)
admin.site.register(CardDeck, CardDeckAdmin)
admin.site.register(BasicCard, BasicCardAdmin)