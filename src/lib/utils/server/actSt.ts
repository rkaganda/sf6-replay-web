import prisma from "@/lib/db";
import { ActStName } from "../../types";

export const getActStNames = async (): Promise<ActStName[]> => {
    try {
        const db_act_st_names = await prisma.act_st_names.findMany()

        const actStNames = db_act_st_names.map((mapping: { id: any; name: any }) => ({
            id: mapping.id,
            name: mapping.name,
        }));
        
        return actStNames
    } catch (error) {
        console.error("Error act_St data:", error);
        throw new Error("Failed act_St data.");
    }
};
