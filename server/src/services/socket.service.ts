import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export class SocketService {
  private static io: Server | null = null;

  public static initialize(server: HttpServer): Server {
    this.io = new Server(server, {
      cors: {
        origin: '*', // We configure this explicitly in development, proxy takes care of connection in production
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[Socket] New connection: ${socket.id}`);

      // Allow sockets to join specific rooms (optional, but good practice)
      socket.on('join_room', (room: string) => {
        socket.join(room);
        console.log(`[Socket] Client ${socket.id} joined room: ${room}`);
      });

      socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
      });
    });

    console.log('[Socket] WebSocket Server Initialized successfully');
    return this.io;
  }

  public static getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.io has not been initialized. Call initialize(server) first.');
    }
    return this.io;
  }

  public static broadcastAlert(alert: any) {
    if (this.io) {
      this.io.emit('new_alert', alert);
      console.log(`[Socket] Broadcasted new alert: ${alert.message}`);
    }
  }

  public static broadcastTelemetry(readings: any[]) {
    if (this.io) {
      this.io.emit('crowd_telemetry', readings);
    }
  }

  public static broadcastIncident(incident: any) {
    if (this.io) {
      this.io.emit('new_incident', incident);
      console.log(`[Socket] Broadcasted new incident logged: ${incident.type} at ${incident.location}`);
    }
  }
}
