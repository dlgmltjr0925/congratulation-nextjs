FROM node:lts
MAINTAINER Brain <dlgmltjr0925@gmail.com>

EXPOSE 3000

# STEP 1. Create Work directory
RUN mkdir -p /www

# STEP 2. Change Work directory 
WORKDIR /www

# STEP 3. Copy package info
COPY package.json .

# STEP 4. Get node_modules
RUN yarn 

# STEP 5. Copy source code
COPY . .

# STEP 6. Build
RUN yarn build

# STEP 7. Run Server
CMD ["yarn", "start"];