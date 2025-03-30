import { Response } from 'express';
import { Volunteer } from '../models/Volunteer';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const createVolunteer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    const {
      title,
      description,
      date,
      time,
      location,
      requirements,
      maxParticipants
    } = req.body;

    const volunteer = new Volunteer({
      title,
      description,
      date,
      time,
      location,
      requirements,
      maxParticipants,
      organizer: req.user._id
    });

    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

export const getVolunteers = async (req: AuthRequest, res: Response) => {
  try {
    const volunteers = await Volunteer.find()
      .sort({ date: 1 })
      .populate('organizer', 'name profileImage')
      .populate('participants', 'name profileImage');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

export const getVolunteer = async (req: AuthRequest, res: Response) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)
      .populate('organizer', 'name profileImage')
      .populate('participants', 'name profileImage');

    if (!volunteer) {
      return res.status(404).json({ error: '봉사활동을 찾을 수 없습니다.' });
    }

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

export const joinVolunteer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ error: '봉사활동을 찾을 수 없습니다.' });
    }

    if (volunteer.status !== 'open') {
      return res.status(400).json({ error: '이미 마감된 봉사활동입니다.' });
    }

    if (volunteer.currentParticipants >= volunteer.maxParticipants) {
      return res.status(400).json({ error: '참가 인원이 가득 찼습니다.' });
    }

    if (volunteer.participants.includes(req.user._id)) {
      return res.status(400).json({ error: '이미 참가 신청한 봉사활동입니다.' });
    }

    volunteer.participants.push(req.user._id);
    volunteer.currentParticipants += 1;

    if (volunteer.currentParticipants >= volunteer.maxParticipants) {
      volunteer.status = 'closed';
    }

    await volunteer.save();
    await volunteer.populate('participants', 'name profileImage');
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

export const cancelVolunteer = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ error: '봉사활동을 찾을 수 없습니다.' });
    }

    const participantIndex = volunteer.participants.indexOf(req.user._id);
    if (participantIndex === -1) {
      return res.status(400).json({ error: '참가 신청하지 않은 봉사활동입니다.' });
    }

    volunteer.participants.splice(participantIndex, 1);
    volunteer.currentParticipants -= 1;

    if (volunteer.status === 'closed' && volunteer.currentParticipants < volunteer.maxParticipants) {
      volunteer.status = 'open';
    }

    await volunteer.save();
    await volunteer.populate('participants', 'name profileImage');
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

export const completeVolunteer = async (req: AuthRequest, res: Response) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ error: '봉사활동을 찾을 수 없습니다.' });
    }

    if (volunteer.organizer.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ error: '봉사활동을 완료할 권한이 없습니다.' });
    }

    volunteer.status = 'completed';
    await volunteer.save();

    // 참가자들의 봉사 시간 업데이트
    const hoursPerParticipant = 4; // 예시: 참가자당 4시간
    await User.updateMany(
      { _id: { $in: volunteer.participants } },
      { $inc: { volunteerHours: hoursPerParticipant } }
    );

    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}; 