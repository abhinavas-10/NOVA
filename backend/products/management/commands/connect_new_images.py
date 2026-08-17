from pathlib import Path

from django.core.management.base import BaseCommand
from django.core.files import File

from products.models import Product, ProductImage


class Command(BaseCommand):
    help = "Connect the 40 generated NØVA product images to products 56-75"

    products = [
        "essential-oversized-tee",
        "heavyweight-tee",
        "relaxed-cargo-pants",
        "wide-leg-trouser",
        "classic-bomber",
        "urban-tech-jacket",
        "oversized-denim-jacket",
        "utility-cargo-shorts",
        "essential-hoodie",
        "heavyweight-sweatshirt",
        "womens-oversized-tee",
        "womens-graphic-tee",
        "womens-wide-leg-pants",
        "womens-relaxed-jogger",
        "womens-cropped-bomber",
        "womens-puffer-jacket",
        "womens-denim-jacket",
        "womens-essential-hoodie",
        "womens-zip-hoodie",
        "womens-denim-shorts",
    ]

    def handle(self, *args, **kwargs):

        media_path = Path("media/products")

        for number, slug in enumerate(self.products, start=1):

            try:
                product = Product.objects.get(slug=slug)
            except Product.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(
                        f"Product not found: {slug}"
                    )
                )
                continue

            for image_number in [1, 2]:

                filename = f"{number:02d}-{slug}-{image_number}.png"
                image_path = media_path / filename

                if not image_path.exists():
                    self.stdout.write(
                        self.style.WARNING(
                            f"Image missing: {filename}"
                        )
                    )
                    continue

                # Prevent duplicate ProductImage records
                if ProductImage.objects.filter(
                    product=product,
                    image__icontains=f"{slug}-{image_number}"
                ).exists():
                    self.stdout.write(
                        f"Already connected: {filename}"
                    )
                    continue

                with open(image_path, "rb") as image_file:

                    ProductImage.objects.create(
                        product=product,
                        image=File(
                            image_file,
                            name=f"{slug}-{image_number}.png",
                        ),
                        is_primary=(image_number == 1),
                    )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Connected: {product.name} ← {filename}"
                    )
                )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "Finished connecting new NØVA images!"
            )
        )