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

dotenv.config();

const tunnel = (tunnel_ssh as any).default || tunnel_ssh;

let sequelize: Sequelize | null = null;
let sshTunnel: any = null;


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


async function createTunnel(): Promise<void> {
  return new Promise((resolve, reject) => {
    sshTunnel = tunnel(tunnelConfig, (err: any) => {
      if (err) return reject(err);
      console.log('✅ SSH Tunnel established');
      resolve();
    });

    sshTunnel.on('error', (err: any) => {
      console.error('Tunnel error:', err);
      reject(err);
    });
  });
}

export const connectDB = async (): Promise<Sequelize> => {
  if (sequelize) return sequelize;

  try {
    console.log('Establishing SSH tunnel...');
    await createTunnel();

    sequelize = new Sequelize({
      database: 'biblioteca_kaxaant',
      username: 'biblioteca_kaxaant',
      password: '*biblioteca2025*',
      host: '127.0.0.1',
      port: Number(process.env.SSH_LOCALPORT),
      dialect: 'mysql',
      dialectModule: require('mysql2'),
      pool: { max: 10, min: 0, idle: 10000 },
      models: [Admin, Categorias_Recursos_Electronicos, Eventos, Recursos_Electronicos, Rel_Categorias_Recursos_Electronicos, Slider_Hero, SubEventos],
      retry: {
        max: 3,
        timeout: 10000
      }
    });

    await sequelize.authenticate();
    await sequelize.sync();
    console.log('📦 Database connected');
    return sequelize;
  } catch (error) {
    console.error('Connection error:', error);
    if (sshTunnel) sshTunnel.close();
    sequelize = null;
    throw error;
  }
};