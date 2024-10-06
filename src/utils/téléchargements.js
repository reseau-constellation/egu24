import axios from "axios";
import platform from "platform";
import semver from "semver";
const extentionCompatible = (ext) => {
    if (platform.os?.family?.includes("Ubuntu")) {
        return ext === "deb";
    }
    else if (platform.os?.family?.includes("OS X")) {
        return ext === "dmg";
    }
    else if (platform.os?.family?.includes("Windows")) {
        return ext === "exe";
    }
    else {
        return false;
    }
};
export const plateforme = () => {
    if (platform.os?.family?.includes("Ubuntu")) {
        return "linux";
    }
    else if (platform.os?.family?.includes("OS X")) {
        return "mac";
    }
    else if (platform.os?.family?.includes("Windows")) {
        return "windows";
    }
    else if (platform.os?.family in ["Android", "iOS", "Windows Phone"]) {
        return "téléphoneOuTablette";
    }
};
export const surOrdi = () => {
    const se = plateforme();
    return se && se in ["windows", "mac", "linux"];
};
export const obtLienTéléchargement = async () => {
    const jsonTéléchargements = (await axios.get(IPA_TÉLÉCHARGEMENTS))
        .data;
    let versionPlusRécente = undefined;
    let urlTéléchargement = undefined;
    for (const t of jsonTéléchargements) {
        const version = t.name;
        if (!versionPlusRécente || semver.gt(version, versionPlusRécente)) {
            for (const fichier of t.assets) {
                const ext = fichier.name.split(".").pop();
                if (ext && extentionCompatible(ext)) {
                    versionPlusRécente = version;
                    urlTéléchargement = fichier.browser_download_url;
                }
            }
        }
    }
    return urlTéléchargement;
};
export const correspExtentions = {
    linux: ["deb", "AppImage"],
    mac: ["dmg"],
    windows: ["exe"],
    source: ["zip", "gz"],
};
const extensionsPossibles = Object.values(correspExtentions).flat();
export const trouverSO = ({ ext, }) => {
    return Object.keys(correspExtentions).find((cl) => correspExtentions[cl].includes(ext));
};
export const obtTousLesTéléchargements = async () => {
    const jsonTéléchargements = (await axios.get(IPA_TÉLÉCHARGEMENTS))
        .data;
    const téléchargements = [];
    for (const t of jsonTéléchargements) {
        const version = t.name;
        for (const fichier of t.assets) {
            const ext = fichier.name.split(".").pop();
            const se = trouverSO({ ext });
            if (ext && se) {
                téléchargements.push({
                    version,
                    se,
                    url: fichier.browser_download_url,
                });
            }
        }
    }
    return téléchargements;
};
export const IPA_TÉLÉCHARGEMENTS = "https://api.github.com/repos/reseau-constellation/iug/releases";
export const URL_TÉLÉCHARGEMENTS = "https://github.com/reseau-constellation/iug/releases";
