import axios from 'axios';

// --- Interfaces para Tipado Fuerte ---
export interface MiroCardData {
    title?: string;
    description?: string;
    fillColor?: string;
}

// --- Configuración de Miro API ---
const MIRO_API_BASE_URL = "https://api.miro.com/v2/boards/";
const BOARD_ID = import.meta.env.VITE_MIRO_BOARD_ID;
const ACCESS_TOKEN = import.meta.env.VITE_MIRO_ACCESS_TOKEN;

const headers = {
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
};

const miroApi = axios.create({
    baseURL: `${MIRO_API_BASE_URL}${BOARD_ID}/`,
    headers
});


/**
 * @description Fetches all cards from the Miro board.
 * @returns {Promise<any>} A promise that resolves with the list of cards.
 */
export const getMiroCards = async () => {
    try {
        const response = await miroApi.get('cards');
        return response.data;
    } catch (error) {
        console.error("Error fetching Miro cards:", error);
        throw error;
    }
};

/**
 * @description Creates a new card on the Miro board.
 * @param {object} cardData - The data for the card to be created.
 * @param {number} x_pos - The x position of the card.
 * @param {number} y_pos - The y position of the card.
 * @returns {Promise<any>} A promise that resolves with the created card data.
 */
export const createMiroCard = async (cardData: MiroCardData, x_pos = 0, y_pos = 0) => {
    const miroCardPayload = {
        "data": {
            "title": cardData.title || "Nueva Tarjeta CoomÜnity",
            "description": cardData.description || "",
        },
        "style": {
            "fillColor": cardData.fillColor || "#F2F2F2",
            "fontColor": "#1A1A1A"
        },
        "position": {
            "x": x_pos,
            "y": y_pos,
            "origin": "center"
        }
    };

    try {
        const response = await miroApi.post('cards', miroCardPayload);
        return response.data;
    } catch (error) {
        console.error("Error creating Miro card:", error);
        throw error;
    }
};

/**
 * @description Updates an existing card on the Miro board.
 * @param {string} cardId - The ID of the card to update.
 * @param {object} cardData - The new data for the card.
 * @returns {Promise<any>} A promise that resolves with the updated card data.
 */
export const updateMiroCard = async (cardId: string, cardData: MiroCardData) => {
    const updatePayload = {
        "data": {
            "title": cardData.title,
            "description": cardData.description
        },
        "style": {
            "fillColor": cardData.fillColor
        }
    };

    try {
        const response = await miroApi.patch(`cards/${cardId}`, updatePayload);
        return response.data;
    } catch (error) {
        console.error(`Error updating Miro card ${cardId}:`, error);
        throw error;
    }
};

const miroService = {
    getMiroCards,
    createMiroCard,
    updateMiroCard
};

export default miroService;
