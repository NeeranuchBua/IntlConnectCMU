import GoogleIcon from './icons/Google.svg';
import NotFound from './NotFound.png';
import CMUlogo from './icons/CMUlogo.png';
import CMULogo2 from './icons/CMU.png';
import landing from './LandingImage.png';
import cmuWSLogo from './icons/IntlConlogo.png';
import postgreSQL from './services/postgresql.png';
import redis from './services/redis-icon.svg';
import docker_container from './services/docker.png';
import server from './services/server.png';
import nginx from './services/nginx.png';
import terraform from './services/terraform.png';
import nutanix from './services/nutanix.svg';
import proxmox from './services/proxmox.svg';
import mysql from './services/mysql.png';
import cmuBG from './cmu_bg.png';
import LineIcon from './services/line.png';

export const ImageInventory = {
    Logo: {
        large: cmuWSLogo,
        medium: cmuWSLogo,
        small: cmuWSLogo,
    },
    icons: {
        google: GoogleIcon,
        line: LineIcon,
    },
    NotFound: NotFound,
    CMULogo: CMUlogo,
    CMULogo2: CMULogo2,
    landing: landing,
    cmuBG: cmuBG,
    Icon: {
        PostgreSQL: postgreSQL,
        Redis: redis,
        Docker: docker_container,
        Server: server,
        Nginx: nginx,
        Terraform: terraform,
        Nutanix: nutanix,
        Proxmox: proxmox,
        MySQL: mysql
    }
};