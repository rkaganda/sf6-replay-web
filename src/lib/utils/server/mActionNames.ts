import prisma from "@/lib/db";
import { MActionName } from "../../types";

export const getMActionNames = async (character_id: number): Promise<MActionName[]> => {
    try {
        const db_m_action_names = await prisma.m_action_names.findMany({
            where: { character_id: character_id }
        });

        const mActionNames = db_m_action_names.map((mapping: { m_action_id: any; name: any }) => ({
            id: mapping.m_action_id,
            name: mapping.name,
        }));
        
        return mActionNames
    } catch (error) {
        console.error("Error act_St data:", error);
        throw new Error("Failed act_St data.");
    }
};
