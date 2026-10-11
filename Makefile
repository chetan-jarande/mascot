.PHONY: help install dev build test lint preview clean

.DEFAULT_GOAL := help

help:
	@echo "Metadata-Driven Mascot Framework Studio - Available Targets:"
	@echo "  make help     - Show this help message"
	@echo "  make install  - Install dependencies (npm install)"
	@echo "  make dev      - Start development server (npm run dev)"
	@echo "  make build    - Build production assets (npm run build)"
	@echo "  make test     - Run test suite (npm run test)"
	@echo "  make lint     - Run type checking and linter (npm run lint)"
	@echo "  make preview  - Preview production build (npm run preview)"
	@echo "  make clean    - Clean build artifacts and cache"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

preview:
	npm run preview

clean:
	rm -rf dist node_modules/.vite
