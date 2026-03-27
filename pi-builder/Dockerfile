FROM vascoguita/raspios:armhf-20250820
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y && \
    apt-get install -y curl bash git build-essential \ 
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpixman-1-dev \
    python3 \
    pkg-config && \
    rm -rf /var/lib/apt/lists/*

ENV NVM_DIR="/root/.nvm"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install 22 && \
    nvm alias default 22 && \
    nvm use default

# Set the PATH and NODE_PATH environment variables for subsequent commands and container runtime
#ENV NODE_PATH=$NVM_DIR/versions/node/v22/lib/node_modules
#ENV PATH=$NVM_DIR/versions/node/v22/bin:$PATH

# Verify the installation (optional)
#RUN node -v
#RUN npm -v

# Set your application's entry point
CMD ["bash"]
