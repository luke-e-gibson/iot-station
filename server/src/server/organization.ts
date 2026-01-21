"use server";

import { headers } from "next/headers";
import { auth } from "./better-auth";

function slugify(text: string) {
    //max 15 characters
    if(text.length > 15) {
        text = text.substring(0, 15);
    }

    return text   
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
}

export async function CreateTeam(name: string) {
    //Check slug uniqueness
    let slug = slugify(name);

    const existing = await auth.api.checkOrganizationSlug({
        body: {
            slug: slug
        }
    });
    if(existing.status) {
       slug = `${slug}-${Math.floor(Math.random() * 1000)}`; 
    }

    const teamData = await auth.api.createOrganization({
        body: {
            name: name,
            slug: slug,
            keepCurrentActiveOrganization: false,
        },
        headers: await headers(),
    })

    console.log(teamData)

    return {
        success: true,
        team: teamData?.name,
    }
}


