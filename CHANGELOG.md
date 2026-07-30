# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Self-hosted backend with SQLite database
- Express.js API server with JWT authentication
- Provider abstraction layer (Supabase or self-hosted backend)
- SIP configuration module with provider presets
- Docker Compose deployment
- GitHub Actions CI workflow
- Comprehensive documentation
- Data seeder with sample leads

### Changed
- Rebranded from "Apex Precision Billing" to "Cold Dialer"
- Refactored SIP configuration into separate module
- Updated hooks to support multiple data providers

### Fixed
- Removed hardcoded email from dev user
- Updated .env.example with all configuration options
- Expanded .gitignore for better security

## [1.0.0] - 2026-01-XX

### Added
- Initial release
- React + Vite + TypeScript frontend
- Supabase integration for data storage
- SIP.js softphone with SignalWire support
- Lead management with CSV import
- Campaign management
- Call scripts with objection handling
- Call history and logging
- Dashboard with analytics
- Admin panel
