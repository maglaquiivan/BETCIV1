/**
 * Storage Cleanup Utility
 * Run this to clean up large data from localStorage that may cause 431 errors
 */

(function() {
    console.log('=== Storage Cleanup Utility ===');
    
    // Check current storage size
    let totalSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const itemSize = (localStorage[key].length + key.length) * 2; // UTF-16 = 2 bytes per char
            totalSize += itemSize;
            console.log(`${key}: ${(itemSize / 1024).toFixed(2)} KB`);
        }
    }
    console.log(`Total localStorage size: ${(totalSize / 1024).toFixed(2)} KB`);
    
    // Clean up user session if it contains profilePicture
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
        try {
            const session = JSON.parse(userSession);
            if (session.profilePicture) {
                console.log('Removing profilePicture from userSession...');
                delete session.profilePicture;
                localStorage.setItem('userSession', JSON.stringify(session));
                console.log('✓ ProfilePicture removed from userSession');
            }
        } catch (e) {
            console.error('Error cleaning userSession:', e);
        }
    }
    
    // Clean up old form drafts (keep only recent ones)
    const draftKeys = ['applicationFormDraft', 'admissionFormDraft', 'registrationFormDraft'];
    draftKeys.forEach(key => {
        const draft = localStorage.getItem(key);
        if (draft) {
            const draftSize = (draft.length * 2) / 1024;
            console.log(`Found ${key}: ${draftSize.toFixed(2)} KB`);
            
            // If draft is older than 7 days, remove it
            try {
                const draftData = JSON.parse(draft);
                if (draftData.timestamp) {
                    const age = Date.now() - draftData.timestamp;
                    const days = age / (1000 * 60 * 60 * 24);
                    if (days > 7) {
                        localStorage.removeItem(key);
                        console.log(`✓ Removed old ${key} (${days.toFixed(1)} days old)`);
                    }
                }
            } catch (e) {
                console.error(`Error processing ${key}:`, e);
            }
        }
    });
    
    // Check final size
    totalSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += (localStorage[key].length + key.length) * 2;
        }
    }
    console.log(`Final localStorage size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log('=== Cleanup Complete ===');
})();
