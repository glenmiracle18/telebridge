import { PrismaClient, Specialty, UserRole, RecordType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      clerkId: 'admin_clerk_id',
      email: 'admin@telebridge.com',
      phoneNumber: '+1234567890',
      password: await hash('admin123', 10),
      role: UserRole.ADMIN,
    },
  });

  console.log('Admin user created:', adminUser.id);

  // Create doctor users with profiles
  const doctors = [
    {
      user: {
        clerkId: 'clerk_doctor_1',
        email: 'dr.smith@telebridge.com',
        phoneNumber: '+1987654321',
        password: await hash('doctor123', 10),
        role: UserRole.DOCTOR,
      },
      profile: {
        fullName: 'Dr. Sarah Smith',
        specialty: Specialty.CARDIOLOGIST,
        hospital: 'Heart & Vascular Institute',
        yearsOfExperience: 12,
        languagesSpoken: 'English, Spanish',
        profilePhoto: 'https://randomuser.me/api/portraits/women/45.jpg',
        bio: 'Dr. Smith is a board-certified cardiologist with over 12 years of experience in treating complex cardiovascular conditions. She specializes in preventive cardiology and heart failure management.',
        education: 'MD from Johns Hopkins University, Cardiology Fellowship at Mayo Clinic',
        qualifications: 'Board Certified in Cardiology, Fellow of the American College of Cardiology',
        consultationFee: 150.00,
        rating: 4.8,
      },
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 1, startTime: '13:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '12:00' },
        { dayOfWeek: 3, startTime: '13:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '14:00' },
      ],
    },
    {
      user: {
        clerkId: 'clerk_doctor_2',
        email: 'dr.johnson@telebridge.com',
        phoneNumber: '+1876543210',
        password: await hash('doctor123', 10),
        role: UserRole.DOCTOR,
      },
      profile: {
        fullName: 'Dr. Michael Johnson',
        specialty: Specialty.NEUROLOGIST,
        hospital: 'Neuroscience Medical Center',
        yearsOfExperience: 15,
        languagesSpoken: 'English, French',
        profilePhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'Dr. Johnson is a neurologist specializing in movement disorders and neurodegenerative diseases. He has extensive experience in treating Parkinson\'s disease and essential tremor.',
        education: 'MD from Stanford University, Neurology Residency at UCSF',
        qualifications: 'Board Certified in Neurology, Member of American Academy of Neurology',
        consultationFee: 175.00,
        rating: 4.9,
      },
      availability: [
        { dayOfWeek: 2, startTime: '08:00', endTime: '12:00' },
        { dayOfWeek: 2, startTime: '13:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '12:00' },
        { dayOfWeek: 4, startTime: '13:00', endTime: '16:00' },
      ],
    },
    {
      user: {
        clerkId: 'clerk_doctor_3',
        email: 'dr.patel@telebridge.com',
        phoneNumber: '+1765432109',
        password: await hash('doctor123', 10),
        role: UserRole.DOCTOR,
      },
      profile: {
        fullName: 'Dr. Anita Patel',
        specialty: Specialty.PEDIATRICIAN,
        hospital: 'Children\'s Medical Center',
        yearsOfExperience: 8,
        languagesSpoken: 'English, Hindi, Gujarati',
        profilePhoto: 'https://randomuser.me/api/portraits/women/65.jpg',
        bio: 'Dr. Patel is a compassionate pediatrician dedicated to providing comprehensive care for children from birth through adolescence. She has special interest in developmental pediatrics and adolescent health.',
        education: 'MD from University of Pennsylvania, Pediatric Residency at Children\'s Hospital of Philadelphia',
        qualifications: 'Board Certified in Pediatrics, Member of American Academy of Pediatrics',
        consultationFee: 125.00,
        rating: 4.7,
      },
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '15:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '15:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '15:00' },
        { dayOfWeek: 6, startTime: '10:00', endTime: '13:00' },
      ],
    },
    {
      user: {
        clerkId: 'clerk_doctor_4',
        email: 'dr.rodriguez@telebridge.com',
        phoneNumber: '+1654321098',
        password: await hash('doctor123', 10),
        role: UserRole.DOCTOR,
      },
      profile: {
        fullName: 'Dr. Carlos Rodriguez',
        specialty: Specialty.PSYCHIATRIST,
        hospital: 'Behavioral Health Institute',
        yearsOfExperience: 10,
        languagesSpoken: 'English, Spanish',
        profilePhoto: 'https://randomuser.me/api/portraits/men/67.jpg',
        bio: 'Dr. Rodriguez specializes in adult psychiatry with focus on mood disorders, anxiety, and PTSD. He takes a holistic approach to mental health treatment, combining medication management with therapy recommendations.',
        education: 'MD from Columbia University, Psychiatry Residency at NYU',
        qualifications: 'Board Certified in Psychiatry, Certified in Cognitive Behavioral Therapy',
        consultationFee: 165.00,
        rating: 4.6,
      },
      availability: [
        { dayOfWeek: 1, startTime: '12:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '12:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '12:00', endTime: '18:00' },
      ],
    },
    {
      user: {
        clerkId: 'clerk_doctor_5',
        email: 'dr.wong@telebridge.com',
        phoneNumber: '+1543210987',
        password: await hash('doctor123', 10),
        role: UserRole.DOCTOR,
      },
      profile: {
        fullName: 'Dr. Emily Wong',
        specialty: Specialty.DERMATOLOGIST,
        hospital: 'Skin & Aesthetic Center',
        yearsOfExperience: 7,
        languagesSpoken: 'English, Mandarin',
        profilePhoto: 'https://randomuser.me/api/portraits/women/79.jpg',
        bio: 'Dr. Wong is a board-certified dermatologist specializing in medical, surgical, and cosmetic dermatology. She has particular expertise in treating acne, eczema, psoriasis, and skin cancer.',
        education: 'MD from Yale University, Dermatology Residency at University of California',
        qualifications: 'Board Certified in Dermatology, Member of American Academy of Dermatology',
        consultationFee: 145.00,
        rating: 4.8,
      },
      availability: [
        { dayOfWeek: 2, startTime: '09:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '16:00' },
        { dayOfWeek: 6, startTime: '09:00', endTime: '12:00' },
      ],
    },
  ];

  // Create each doctor with their profile and availability
  for (const doctor of doctors) {
    const user = await prisma.user.create({
      data: doctor.user,
    });

    console.log(`Created doctor user: ${user.email}`);

    const doctorProfile = await prisma.doctor.create({
      data: {
        userId: user.id,
        ...doctor.profile,
      },
    });

    console.log(`Created doctor profile for: ${doctorProfile.fullName}`);

    // Create availability slots for each doctor
    for (const slot of doctor.availability) {
      await prisma.availability.create({
        data: {
          doctorId: doctorProfile.id,
          ...slot,
        },
      });
    }

    console.log(`Created availability slots for: ${doctorProfile.fullName}`);
  }

  // Create patient user
  const patientUser = await prisma.user.create({
    data: {
      clerkId: 'clerk_patient_1',
      email: 'patient@telebridge.com',
      phoneNumber: '+1432109876',
      password: await hash('patient123', 10),
      role: UserRole.PATIENT,
    },
  });

  console.log('Created patient user:', patientUser.email);

  // Create patient profile
  const patientProfile = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      fullName: 'John Doe',
      gender: 'MALE',
      dateOfBirth: new Date('1985-05-15'),
      location: 'New York City',
      category: 'GENERAL',
      emergencyContact: '+1321098765',
    },
  });

  console.log('Created patient profile for:', patientProfile.fullName);

  // Create some medical records for the patient
  const medicalRecords = [
    {
      title: 'Annual Physical Examination',
      description: 'Routine annual physical examination. Blood pressure: 120/80, Heart rate: 72 bpm. Overall health is good.',
      recordType: RecordType.CONSULTATION,
      patientId: patientProfile.id,
    },
    {
      title: 'Blood Test Results',
      description: 'Complete blood count and metabolic panel. All values within normal range.',
      recordType: RecordType.LAB_RESULT,
      patientId: patientProfile.id,
    },
    {
      title: 'Chest X-Ray',
      description: 'Chest X-ray performed for routine screening. No abnormalities detected.',
      recordType: RecordType.IMAGING,
      patientId: patientProfile.id,
    },
  ];

  for (const record of medicalRecords) {
    await prisma.medicalRecord.create({
      data: record,
    });
  }

  console.log('Created medical records for patient:', patientProfile.fullName);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });