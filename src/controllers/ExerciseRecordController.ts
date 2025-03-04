import { AppDataSource } from "@/data-source";
import { ExerciseRecord } from "@/entity/ExerciseRecord";
import { Request, Response } from "express";

// 運動記録のコントローラー
export class ExerciseRecordController {
    // 運動記録の一覧取得
    static async getExerciseRecords(req: Request, res: Response) {
        const { startDate, endDate, type } = req.query;
        const exerciseRecordRepository = AppDataSource.getRepository(ExerciseRecord);
        
        try {
            const whereClause: any = { user: req.user };
            
            // 日付範囲でフィルター
            if (startDate || endDate) {
                whereClause.date = {};
                if (startDate) whereClause.date = { ...whereClause.date, gte: new Date(startDate as string) };
                if (endDate) whereClause.date = { ...whereClause.date, lte: new Date(endDate as string) };
            }
            
            // 運動タイプでフィルター
            if (type) {
                whereClause.exerciseType = type;
            }
    
            const records = await exerciseRecordRepository.find({
                where: whereClause,
                order: { date: 'DESC' }
            });
    
            res.json(records);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch exercise records' });
        }
    }
  
    // 運動記録の作成
    static async createExerciseRecord(req: Request, res: Response) {
        const { exerciseType, date, duration } = req.body;
        const exerciseRecordRepository = AppDataSource.getRepository(ExerciseRecord);
  
        try {
            const record = new ExerciseRecord();
            record.user = req.user;
            record.exerciseType = exerciseType;
            record.date = new Date(date);
            record.duration = duration;

            await exerciseRecordRepository.save(record);
            res.status(201).json(record);
        } catch (error) {
            res.status(400).json({ error: 'Invalid exercise record data' });
        }
    }
}