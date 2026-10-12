import {test,expect} from '@playwright/test';

test('first-run player UI contains an obvious Start and keeps workshop tools optional',async({page})=>{
 await page.goto('./');
 await expect(page.locator('#start-btn')).toBeVisible();
 await expect(page.locator('#workshop-title')).not.toHaveAttribute('open','');
 await expect(page.locator('#art-director-title-open')).toBeHidden();
 await expect(page.locator('#title-art-next')).toBeHidden();
 await expect(page.locator('#art-director-play-open')).toHaveCount(0);
 await expect(page.locator('#start-btn')).toBeFocused();
 await page.locator('#workshop-title > summary').click();
 await expect(page.locator('#art-director-title-open')).toBeVisible();
 await expect(page.locator('#title-art-next')).toBeVisible();
 await page.locator('#start-btn').click();
 await expect(page.locator('#title-overlay')).toHaveClass(/hidden/);
 await expect(page.locator('#pause-btn')).toBeVisible();
 await page.locator('#pause-btn').click();
 await expect(page.locator('#workshop-pause')).not.toHaveAttribute('open','');
 await page.locator('#workshop-pause > summary').click();
 await expect(page.locator('#art-director-pause-open')).toBeVisible();
 await expect(page.locator('#art-preview-pause')).toBeVisible();
});
