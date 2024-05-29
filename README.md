Learning how a SPA integrates with a django DRF application

basically running this guide
part 1: Basic Session based Auth
https://testdriven.io/blog/django-spa-auth/

part 2: JWT integration
https://github.com/seankwarren/Django-React-jwt-authentication?tab=readme-ov-file#what-is-jwt

## with specific differences:

### backend
- backend is managed by poetry instead of pip
- command is instead in compose.yml file rather than a part of a the dockerfile

### frontend
- Frontend is a react application served with Vite and SWC

### Startup

`docker compose --build up`
`docker compose exec backend bash`
`python manage.py migrate`
`python manage.py createsuperuser`

* Navigate to front end at localhost:81
* Login using the superuser created

The `WhoAmI` button is a example of an API that requires token, JWT, or CSRF authentication

The `Refresh Token` button is an example of an API to acquire a new access and refresh token
