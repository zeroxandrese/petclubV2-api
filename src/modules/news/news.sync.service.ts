import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import * as Papa from 'papaparse';

interface SheetNewsRow {
  title: string;
  imageUrl: string;
  descripcion?: string;
}

@Injectable()
export class NewsSyncService {
  private readonly logger = new Logger(NewsSyncService.name);

  constructor(private prisma: PrismaService) { }

  async syncNews(limit = 10) {
    this.logger.log('Starting manual news sync...');

    const sheetRows: SheetNewsRow[] = await this.getSheetRows();

    if (sheetRows.length === 0) {
      this.logger.warn('No rows found in the Google Sheet.');
      return { message: 'No data found' };
    }

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of sheetRows.slice(0, limit)) {
      try {
        const exists = await this.prisma.news.findFirst({
          where: { title: row.title },
        });

        if (exists) {
          skipped++;
          continue;
        }

        const { bigUrl, smallUrl } = await this.uploadAndTransformImage(
          row.imageUrl,
        );

        await this.prisma.news.create({
          data: {
            title: row.title,
            descripcion: row.descripcion ?? '',
            bigUrlshort: bigUrl,
            smallUrlshort: smallUrl,
            actionPlan: 'NEW',
          },
        });

        processed++;
      } catch (err) {
        errors++;
        this.logger.error(
          `Error processing row ${row.title}`,
          err instanceof Error ? err.stack : String(err),
        );
      }
    }

    return {
      message: 'Manual sync completed',
      processed,
      skipped,
      errors,
    };
  }

  private async getSheetRows(): Promise<SheetNewsRow[]> {
    const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;

    if (!csvUrl) {
      this.logger.error('GOOGLE_SHEET_CSV_URL no está definido en el .env');
      return [];
    }

    try {
      const response = await axios.get<string>(csvUrl, {
        responseType: 'text',
      });

      const csvData = response.data;

      const parsed = Papa.parse<SheetNewsRow>(csvData, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        this.logger.warn('Hubo errores parseando el CSV', parsed.errors);
      }

      return parsed.data;
    } catch (error) {
      this.logger.error('Error descargando el CSV de Google Sheets', error);
      return [];
    }
  }

  private async uploadAndTransformImage(imageUrl: string) {
    const response = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);

    const upload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'news_general',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    const publicId = upload.public_id;

    const bigUrl = cloudinary.url(publicId, {
      transformation: [
        { aspect_ratio: '1.0', height: 506, crop: 'fill', gravity: 'auto' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    const smallUrl = cloudinary.url(publicId, {
      transformation: [
        { width: 104, height: 104, crop: 'fill', gravity: 'auto' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return { bigUrl, smallUrl };
  }
}