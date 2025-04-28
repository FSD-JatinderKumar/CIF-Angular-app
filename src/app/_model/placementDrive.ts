
  
  export interface RESPONSE {
    RESULT: RESULT[];
  }
  
  export class RESULT {
    driveId?: Number;
    batchYear?: Number;
    companyId?: Number;
    stream?: any;
    placementSoftSkillRequestDetail: Details[];
  }


  export class Details {

    roundId: Number;
    feedback: string;
    facultyRemarks: string;
    companyRemarks: string;
    totalEligible: string;
    totalRegistered: string;
    totalPresent: string;
    totalSelected: string;
    totalAbsent: string;
    totalNotSelected: string;
    totalLeft: string
  }