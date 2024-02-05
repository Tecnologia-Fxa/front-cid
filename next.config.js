/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV_RUTA_ACTUAL,
        uploadPath: process.env.NODE_ENV === 'production' ? '/upload.php' : '/api/upload'
    }
};
module.exports = nextConfig;