FROM mcr.microsoft.com/vscode/devcontainers/universal:latest

# Copy custom first notice message.
COPY first-run-notice.txt /tmp/staging/
RUN sudo mv -f /tmp/staging/first-run-notice.txt /usr/local/etc/vscode-dev-containers/ \
    && sudo rm -rf /tmp/staging

# Install PowerShell 7.x

# Install Functions Core Tools

# Install mechanical-markdown for quickstart validations
RUN pip install mechanical-markdown
