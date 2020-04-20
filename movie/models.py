from django.db import models

# Create your models here.

class Movie(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    title = models.TextField(verbose_name="Title")
    year = models.IntegerField(verbose_name="Year")
    runTime = models.IntegerField(verbose_name="Run Time")
    categories = models.TextField(verbose_name="Categories")
    rating = models.IntegerField(verbose_name="Rating")
    poster = models.TextField(verbose_name="Poster URL", blank=True)

    def categories_as_list(self):
        return self.categories.split(',')

    def __str__(self):
        return self.title

class Category(models.Model):
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.category
