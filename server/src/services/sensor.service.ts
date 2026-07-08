import { prisma } from '../prisma';
import { SocketService } from './socket.service';

interface SectionConfig {
  sectionId: string;
  capacity: number;
  initialCount: number;
}

const SECTIONS: SectionConfig[] = [
  { sectionId: 'GATE_3', capacity: 8000, initialCount: 4200 },
  { sectionId: 'GATE_5', capacity: 6000, initialCount: 5800 }, // Overcrowded
  { sectionId: 'GATE_12', capacity: 10000, initialCount: 3100 },
  { sectionId: 'CONCOURSE_A', capacity: 4000, initialCount: 2200 },
  { sectionId: 'CONCOURSE_B', capacity: 5000, initialCount: 4500 }, // Congested
  { sectionId: 'SECTION_102', capacity: 2000, initialCount: 1500 },
  { sectionId: 'SECTION_104', capacity: 2500, initialCount: 2400 }, // High density
  { sectionId: 'SECTION_206', capacity: 3000, initialCount: 900 }
];

export class SensorService {
  private static intervalId: NodeJS.Timeout | null = null;
  private static currentReadings: Map<string, number> = new Map();

  public static async initialize() {
    console.log('[Sensor] Initializing simulated stadium telemetry...');
    
    // Seed initial values in DB if not exist
    for (const sec of SECTIONS) {
      this.currentReadings.set(sec.sectionId, sec.initialCount);
      
      const count = await prisma.sensorReading.count({
        where: { sectionId: sec.sectionId }
      });

      if (count === 0) {
        await prisma.sensorReading.create({
          data: {
            sectionId: sec.sectionId,
            crowdCount: sec.initialCount,
            capacity: sec.capacity
          }
        });
      }
    }

    // Start simulation loop (every 5 seconds)
    this.startSimulation();
  }

  public static startSimulation() {
    if (this.intervalId) return;

    this.intervalId = setInterval(async () => {
      try {
        const updatedReadings = [];

        for (const sec of SECTIONS) {
          const current = this.currentReadings.get(sec.sectionId) || sec.initialCount;
          // Random walk: add or subtract crowd members
          // Simulate game transitions: some areas clear, some get busy
          const fluctuation = Math.floor(Math.random() * 300) - 130; 
          
          // Constrain within bounds
          let nextCount = current + fluctuation;
          if (nextCount > sec.capacity) {
            nextCount = Math.floor(sec.capacity * 0.95); // bounce back slightly below capacity
          }
          if (nextCount < 0) {
            nextCount = 0;
          }

          this.currentReadings.set(sec.sectionId, nextCount);

          // Save to db
          const reading = await prisma.sensorReading.create({
            data: {
              sectionId: sec.sectionId,
              crowdCount: nextCount,
              capacity: sec.capacity
            }
          });

          updatedReadings.push(reading);
        }

        // Keep DB clean: delete sensor readings older than 5 minutes to prevent bloat in SQLite
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        await prisma.sensorReading.deleteMany({
          where: {
            timestamp: {
              lt: fiveMinutesAgo
            }
          }
        });

        // Broadcast to clients
        SocketService.broadcastTelemetry(updatedReadings);

      } catch (err) {
        console.error('[Sensor] Error in simulation loop:', err);
      }
    }, 5000);

    console.log('[Sensor] Telemetry simulation loop started (5s ticks)');
  }

  public static stopSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[Sensor] Telemetry simulation loop stopped');
    }
  }

  public static async getLatestReadings() {
    const latestReadings = [];
    for (const sec of SECTIONS) {
      const reading = await prisma.sensorReading.findFirst({
        where: { sectionId: sec.sectionId },
        orderBy: { timestamp: 'desc' }
      });
      if (reading) {
        latestReadings.push(reading);
      }
    }
    return latestReadings;
  }
}
