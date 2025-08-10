import { Sequelize } from 'sequelize-typescript';
import * as tunnel_ssh from 'tunnel-ssh';
import dotenv from 'dotenv';
import { Admin } from '@/models/Admin.model';
import { Categorias_Recursos_Electronicos } from '@/models/Categorias_Recursos_Electronicos.model';
import { Eventos } from '@/models/Eventos.model';
import { Recursos_Electronicos } from '@/models/Recursos_Electronicos.model';
import { Rel_Categorias_Recursos_Electronicos } from '@/models/Rel_Categorias_Recursos_Electronicos.model';
import { Slider_Hero } from '@/models/Slider_Hero.model';
import { SubEventos } from '@/models/SubEventos.model';
import { setupRelations } from '@/models';

dotenv.config();

const tunnel = (tunnel_ssh as any).default || tunnel_ssh;

let sequelize: Sequelize | null = null;


const tunnelConfig = {
  username: 'biblioteca_kaxaant',
  password: '*biblioteca2025*',
  host: 'academico.upqroo.edu.mx',
  port: 22,
  dstHost: '127.0.0.1',
  dstPort: 3306,
  localHost: '127.0.0.1',
  localPort: 3307,
  keepAlive: true
};


declare global {
  var sshTunnelGlobal: any | undefined;
  var tunnelStartedGlobal: boolean | undefined;
}

const sshTunnel = global.sshTunnelGlobal;
let tunnelStarted = global.tunnelStartedGlobal;

async function createTunnel(): Promise<void> {
  if (global.tunnelStartedGlobal) return;

  return new Promise((resolve, reject) => {
    global.sshTunnelGlobal = tunnel(tunnelConfig, (err: any) => {
      if (err) return reject(err);
      global.tunnelStartedGlobal = true;
      console.log('✅ SSH Tunnel established');
      resolve();
    });

    global.sshTunnelGlobal.on('error', (err: any) => {
      console.error('Tunnel error:', err);
      reject(err);
    });
  });
}

let connectPromise: Promise<Sequelize> | null = null;

export const connectDB = async (): Promise<Sequelize> => {
  // Si ya hay conexión establecida
  if (sequelize) return sequelize;

  // Si ya hay una conexión en curso, espera esa
  if (connectPromise) return connectPromise;

  // Si no hay conexión ni en curso, empieza una
  connectPromise = (async () => {
    try {
      console.log('Establishing SSH tunnel...');
      await createTunnel();

      sequelize = new Sequelize({
        database: 'biblioteca_kaxaant',
        username: 'biblioteca_kaxaant',
        password: '*biblioteca2025*',
        host: '127.0.0.1',
        port: 3307,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        pool: { max: 10, min: 0, idle: 10000 },
        models: [
          Admin,
          Categorias_Recursos_Electronicos,
          Eventos,
          Recursos_Electronicos,
          Rel_Categorias_Recursos_Electronicos,
          Slider_Hero,
          SubEventos
        ],
        retry: {
          max: 3,
          timeout: 10000
        }
      });

      setupRelations();
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('📦 Database connected');
      return sequelize;
      
    } catch (error) {
      console.error('Connection error:', error);
      if (global.sshTunnelGlobal) global.sshTunnelGlobal.close();
      sequelize = null;
      global.tunnelStartedGlobal = false;
      throw error;

    } finally {
      connectPromise = null; // Limpia para próximos intentos
    }
  })();

  return connectPromise;
};
