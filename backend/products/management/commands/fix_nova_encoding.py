from django.core.management.base import BaseCommand
from products.models import Product, Category


class Command(BaseCommand):
    help = "Fix corrupted NØVA text"

    def handle(self, *args, **kwargs):
        old = "N╪VA"
        new = "NØVA"

        products_fixed = 0
        categories_fixed = 0

        for product in Product.objects.all():
            changed = False

            if old in product.name:
                product.name = product.name.replace(old, new)
                changed = True

            if product.brand and old in product.brand:
                product.brand = product.brand.replace(old, new)
                changed = True

            if product.description and old in product.description:
                product.description = product.description.replace(old, new)
                changed = True

            if changed:
                product.save()
                products_fixed += 1

        for category in Category.objects.all():
            changed = False

            if old in category.name:
                category.name = category.name.replace(old, new)
                changed = True

            if category.description and old in category.description:
                category.description = category.description.replace(old, new)
                changed = True

            if changed:
                category.save()
                categories_fixed += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Finished. Products fixed: {products_fixed}, "
                f"Categories fixed: {categories_fixed}"
            )
        )