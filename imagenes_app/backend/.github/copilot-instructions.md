# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a Python project for **SharePoint Azure Direct Connectivity** using Office365-REST-Python-Client. This template allows any department to connect to SharePoint sites and read Excel files without using Microsoft Graph API.

## Key Requirements
- Use secure environment variable management for sensitive credentials
- Implement proper error handling and logging
- Follow Python best practices for API authentication
- Use type hints and proper documentation
- Handle connection timeouts and network errors gracefully
- Support file access by ID for reliability across departments

## Architecture Approach
- **Direct SharePoint Connection**: Use Office365-REST-Python-Client (NOT Microsoft Graph API)
- **File Identification**: Access files by unique ID rather than file paths
- **Modular Design**: Separate connection, authentication, and data processing
- **Department Agnostic**: Easy configuration for different SharePoint sites

## Security Guidelines
- Never hardcode credentials in source code
- Use `.env` files for local development only
- Implement proper exception handling for authentication failures
- Log security events appropriately without exposing sensitive data
- Store file IDs and site URLs as environment variables

## Dependencies
- `msal` for Microsoft Authentication Library
- `requests` for HTTP requests
- `python-dotenv` for environment variable management
- `Office365-REST-Python-Client` for SharePoint operations
- `pandas` for Excel data processing
- `openpyxl` for Excel file reading

## Template Usage
This project serves as a template for any department to:
1. Configure Azure AD application credentials
2. Set SharePoint site URL and file IDs
3. Connect directly to SharePoint without Graph API complexity
4. Read and process Excel files programmatically

## Example Implementation
See `sharepoint_connector_template.py` for a reusable class that can be customized for any department's SharePoint site and Excel files.
