from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVariant


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'price',
        'stock',
        'is_active',
    )

    list_filter = (
        'category',
        'is_active',
    )

    search_fields = (
        'name',
        'description',
    )

    prepopulated_fields = {
        'slug': ('name',)
    }


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = (
        'product',
        'is_primary',
    )


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = (
        'product',
        'color',
        'size',
        'stock',
    )