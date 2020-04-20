from django.shortcuts import render,HttpResponse
from .models import Movie
from .models import Category

# Create your views here.

def index(request):
    movies = Movie.objects

    title = request.GET.get('title')
    if title:
        movies = movies.filter(title__contains = title)

    category = request.GET.get('category')
    if category:
        movies = movies.filter(categories__contains = category)

    runtimeoperator = request.GET.get('runTimeOperator')
    runtime = request.GET.get('runTime')
    if runtime:
        if runtimeoperator == "lte":
            movies = movies.filter(runTime__lte = runtime)
        else:
            movies = movies.filter(runTime__gte = runtime)

    ordercolumn = request.GET.get('ordercolumn')
    orderby = request.GET.get('orderby')
    if ordercolumn:
        if orderby == "ASC":
            movies = movies.order_by(ordercolumn)
        else:
            movies = movies.order_by('-'+ordercolumn)
    else:
        movies = movies.order_by('rating')

    movie_per_page = 2
    page = request.GET.get('page')
    if page:
        offset = int(page)*int(movie_per_page)
    else:
        page = 0
        offset = 0

    limit = int(movie_per_page)+int(page)

    movies = movies[offset:limit]

    categories = Category.objects.all()

    return render(request,"index.html", {"movies": movies, "movie_per_page": movie_per_page, "categories": categories, "selected_categories": category.split(',')})
