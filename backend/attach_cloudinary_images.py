import os
import re

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

import cloudinary.api
from products.models import Product, ProductImage


# Get all Cloudinary images
resources = cloudinary.api.resources(
    type="upload",
    prefix="nova/products",
    max_results=500,
)["resources"]

public_ids = {
    r["public_id"]
    for r in resources
}


def find_images(product):
    slug = product.slug

    # New catalog images:
    # 01-essential-oversized-tee-1
    # 02-heavyweight-tee-1
    # etc.
    numbered = {
        "essential-oversized-tee": "01",
        "heavyweight-tee": "02",
        "relaxed-cargo-pants": "03",
        "wide-leg-trouser": "04",
        "classic-bomber": "05",
        "urban-tech-jacket": "06",
        "oversized-denim-jacket": "07",
        "utility-cargo-shorts": "08",
        "essential-hoodie": "09",
        "heavyweight-sweatshirt": "10",
        "womens-oversized-tee": "11",
        "womens-graphic-tee": "12",
        "womens-wide-leg-pants": "13",
        "womens-relaxed-jogger": "14",
        "womens-cropped-bomber": "15",
        "womens-puffer-jacket": "16",
        "womens-denim-jacket": "17",
        "womens-essential-hoodie": "18",
        "womens-zip-hoodie": "19",
        "womens-denim-shorts": "20",
    }

    if slug in numbered:
        prefix = numbered[slug]
        candidates = [
            f"nova/products/{prefix}-{slug}-1",
            f"nova/products/{prefix}-{slug}-2",
        ]

        return [
            x for x in candidates
            if x in public_ids
        ]

    # Original catalog images
    candidates = [
        f"nova/products/{slug}-1",
        f"nova/products/{slug}-2",
    ]

    # Prefer files without Cloudinary duplicate suffixes
    exact = [
        x for x in candidates
        if x in public_ids
    ]

    if exact:
        return exact

    # Match uploaded versions such as:
    # backpack-1_Q15IbCY
    # backpack-2_QsTkZOf
    matched = []

    for public_id in public_ids:
        filename = public_id.split("/")[-1]

        for number in ("1", "2"):
            pattern = rf"^{re.escape(slug)}-{number}(?:_[A-Za-z0-9]+)?$"

            if re.match(pattern, filename):
                matched.append(public_id)

    return sorted(matched)


# Remove current ProductImage records if any
# (currently there are 0, but this makes the script safe)
ProductImage.objects.all().delete()

created = 0
products_with_images = 0
products_without_images = []

for product in Product.objects.order_by("id"):

    images = find_images(product)

    if not images:
        products_without_images.append(product.slug)
        print(f"NO IMAGE: {product.slug}")
        continue

    products_with_images += 1

    # Maximum 2 images per product
    images = images[:2]

    for index, public_id in enumerate(images):

        ProductImage.objects.create(
            product=product,
            image=public_id,
            is_primary=(index == 0),
        )

        created += 1

        print(
            f"ATTACHED: {product.slug} -> {public_id}"
        )


print()
print("=" * 50)
print("DONE")
print("=" * 50)
print("Products:", Product.objects.count())
print("Products with images:", products_with_images)
print("Products without images:", len(products_without_images))
print("ProductImage records created:", created)

if products_without_images:
    print()
    print("Products without images:")
    for slug in products_without_images:
        print(" -", slug)