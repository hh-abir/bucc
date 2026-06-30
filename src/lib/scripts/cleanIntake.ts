/**
 * Clean Intake Script
 * 
 * This script removes all non-accepted applicants from the current intake cycle.
 * It's designed to be run after the intake process is complete.
 * 
 * What it deletes:
 * - PreRegMember: Initial registration records
 * - EvaluationData: Applicant responses and assessments (non-accepted)
 * 
 * What it keeps:
 * - All EvaluationData with status "Accepted"
 * - All User accounts created during onboarding
 * 
 */

import dbConnect from '@/lib/dbConnect';   

async function cleanIntake() {
    await dbConnect();

    const PreRegMember = require('../../model/PreRegMember')
    const EvaluationData = require('../../model/EvaluationData')

    const allEvaluations = await EvaluationData.find({})

    const deletableData: { email: string; studentId: string }[] = []

    for (const evaluation of allEvaluations) {
        if (evaluation.status !== "Accepted") {
            const email = evaluation.email 
            const studentId = evaluation.studentId
            
            if (!deletableData.find(item => item.email === email)) {
                deletableData.push({ email, studentId })
            }
        }
    }

    console.log(`Found ${deletableData.length} non-accepted members to delete`)

    for (const { email, studentId } of deletableData) {
        const deletedPrereg = await PreRegMember.deleteMany({ email })
        const deletedEvaluation = await EvaluationData.deleteMany({ 
            email, 
            status: { $ne: "Accepted" } 
        })
        
        console.log(`Deleted records for ${email}:`, {
            prereg: deletedPrereg.deletedCount,
            evaluation: deletedEvaluation.deletedCount,
        })
    }

    console.log("✅ Successfully cleaned up non-accepted members and related data")
}

// Run the cleanup
cleanIntake()
    .then(() => {
        console.log("Cleanup completed")
        process.exit(0)
    })
    .catch((error) => {
        console.error("Cleanup failed:", error)
        process.exit(1)
    })
