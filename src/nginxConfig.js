const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const templateContent = `##
# Redirect to www
##
server {
    listen 443 ssl;
    listen 80;
    server_name {{DOMAIN}};

    ssl_certificate /etc/nginx/ssl/{{DOMAIN}}/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/{{DOMAIN}}/privkey.pem;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

    return 301 $scheme://www.$host$request_uri;
}

server {    
    listen 443 ssl;
    listen 80;

    root /var/www/{{DOMAIN}}/{{PUBLIC_FOLDER}};
    index index.php index.html index.htm;
    add_header X-Frame-Options DENY;
    
    # Make site accessible from http://localhost/
    server_name www.{{DOMAIN}};

    ssl_certificate /etc/nginx/ssl/{{DOMAIN}}/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/{{DOMAIN}}/privkey.pem;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;  # Update this according to your PHP-FPM version and socket path
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    error_page 404 =200 /index.html;
}
`;

function createNginxConfig(domain, publicFolder, callback) {
    const configContent = templateContent
        .replace(/{{DOMAIN}}/g, domain)
        .replace(/{{PUBLIC_FOLDER}}/g, publicFolder);

    const configPath = path.join(__dirname, `${domain}.conf`);

    fs.writeFile(configPath, configContent, 'utf8', (err) => {
        if (err) {
            callback(`Error writing Nginx config file: ${err.message}`);
            return;
        }

        exec(`sudo cp ${configPath} /etc/nginx/sites-available/${domain} && sudo ln -s /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/`, (error, stdout, stderr) => {
            if (error) {
                callback(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                callback(`Stderr: ${stderr}`);
                return;
            }
            callback(null, `Nginx configuration for ${domain} created and enabled`);
        });
    });
}

module.exports = { createNginxConfig };
