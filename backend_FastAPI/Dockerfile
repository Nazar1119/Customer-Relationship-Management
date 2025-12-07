# FROM python:3.11-bullseye

# WORKDIR /app

# RUN apt-get update && apt-get install -y \
#     gcc \
#     g++ \
#     unixodbc \
#     unixodbc-dev \
#     curl \
#     gnupg \
#     && rm -rf /var/lib/apt/lists/*

# # Завантажити і встановити драйвер msodbcsql18 напряму
# RUN curl -sSL https://packages.microsoft.com/debian/11/prod/pool/main/m/msodbcsql18/msodbcsql18_18.3.1.1-1_amd64.deb -o msodbcsql18.deb \
#     && ACCEPT_EULA=Y dpkg -i msodbcsql18.deb || apt-get -f install -y \
#     && rm msodbcsql18.deb

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 8000

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
