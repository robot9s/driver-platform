import { createDocumentUploadUrl } from "./procedures/create-document-upload-url";
import { deleteCertification } from "./procedures/delete-certification";
import { deleteDocument } from "./procedures/delete-document";
import { deleteExperience } from "./procedures/delete-experience";
import { deleteTruck } from "./procedures/delete-truck";
import { getMyProfile } from "./procedures/get-my-profile";
import { saveCertification } from "./procedures/save-certification";
import { saveDocument } from "./procedures/save-document";
import { saveExperience } from "./procedures/save-experience";
import { saveTruck } from "./procedures/save-truck";
import { upsertProfile } from "./procedures/upsert-profile";

export const driversRouter = {
	getMyProfile,
	upsertProfile,
	saveExperience,
	deleteExperience,
	saveCertification,
	deleteCertification,
	saveDocument,
	deleteDocument,
	saveTruck,
	deleteTruck,
	documentUploadUrl: createDocumentUploadUrl,
};
