import { Controller, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post(':id')
  async createReport(
    @Req() req: any,
    @Param('id') reportedUserId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    const reporterId = req.user.uid; 
    
    return this.reportsService.createReport(reporterId, reportedUserId, createReportDto);
  }

  @Delete(':id')
  async deleteReport(
    @Param('id') reportId: string,
  ) {
    return this.reportsService.deleteReport(reportId);
  }
}