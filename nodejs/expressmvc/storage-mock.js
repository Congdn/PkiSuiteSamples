'use strict';
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

const APP_ROOT = process.cwd();

const SampleDocs = {
	SAMPLE_PDF: 0,
	PDF_SIGNED_ONCE: 1,
	PDF_SIGNED_TWICE: 2,
	CMS_SIGNED_ONCE: 3,
	CMS_SIGNED_TWICE: 4
};

class StorageMock {

	static get appDataPath() {
		return path.join(APP_ROOT, 'app-data');
	}

	static get resourcesPath() {
		return path.join(APP_ROOT, 'resources');
	}

	static getDataPath(fileId, extension = '') {
		let filename = fileId.replace('_', '.');
		return path.join(StorageMock.appDataPath, filename + extension);
	}

	static getResourcePath(resource) {
		return path.join(StorageMock.resourcesPath, resource);
	}

	static existsSync({fileId, extension = '', outputFilename = false}) {
		let filename = fileId.replace('_', '.') + extension;
		let filePath = path.join(StorageMock.appDataPath, filename);
		let exists = fs.existsSync(filePath);

		if (outputFilename) {
			return { exists, filename };
		}

		return fs.existsSync(filePath);
	}

	static storeSync(content, filename = null, extension = '') {

		// Guarantees that the 'app-data' folder exists.
		StorageMock.createAppData();

		// Generate fileId.
		if (!filename) {
			filename = uuidv4();
		}
		let fileId = filename + extension;

		// Store file.
		let filePath = path.join(StorageMock.appDataPath, fileId);
		fs.writeFileSync(filePath, content);

		// Replace extension '.' to '_' to be passed as parameters on URL for
		// URL safety.
		return fileId.replace('.', '_');
	}

	static readSync(fileId, extension = '') {
		let filename = fileId.replace('_', '.') + extension;
		let filePath = path.join(StorageMock.appDataPath, filename);
		return fs.readFileSync(filePath);
	}
	static getSampleDocName(sampleId) {
		switch (sampleId) {
			case SampleDocs.SAMPLE_PDF:
				return 'SampleDocument.pdf';
			case SampleDocs.PDF_SIGNED_ONCE:
				return 'SamplePdfSignedOnce.pdf';
			case SampleDocs.PDF_SIGNED_TWICE:
				return 'SamplePdfSignedTwice.pdf';
			case SampleDocs.CMS_SIGNED_ONCE:
				return 'SampleCms.p7s';
			case SampleDocs.CMS_SIGNED_TWICE:
				return 'SampleCmsSignedTwice.p7s';
			default:
				throw new Error('Invalid sample document identification.');
		}
	}
	static getSampleDocPath(sampleId) {
		const filename = StorageMock.getSampleDocName(sampleId);
		return path.join(APP_ROOT, 'public', filename);
	}

	static getPdfStampPath() {
		return path.join(APP_ROOT, 'public', 'PdfStamp.png');
	}

	static getPdfStampContent() {
		return fs.readFileSync(path.join(APP_ROOT, 'public', 'PdfStamp.png'));
	}

	static getBatchDocPath(id) {
		return path.join(APP_ROOT, 'public', `0${id % 10}.pdf`);
	}

	static createAppData() {
		if (!fs.existsSync(StorageMock.appDataPath)) {
			fs.mkdirSync(StorageMock.appDataPath);
		}
	}


}

exports.SampleDocs = SampleDocs;
exports.StorageMock = StorageMock;