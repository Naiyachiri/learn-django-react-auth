# pull official base image
FROM python:3.11.4 as backend

# set working directory
WORKDIR /usr/local/backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update
# Make working inside the container nicer
RUN apt install -y vim cron less
RUN sed -i 's/# \(.*LS_.*\)/\1/' ~/.bashrc
RUN echo "tabs 8" >> ~/.bashrc

# install dependencies
COPY poetry.lock pyproject.toml ./
# Install and configure Poetry and upgrade Pip (ver also in pyproject.toml)
RUN pip install --upgrade pip \
    && pip install --no-cache-dir poetry==1.8.* \
    # Install dependencies to the system instead of venv
    && poetry config virtualenvs.create false

