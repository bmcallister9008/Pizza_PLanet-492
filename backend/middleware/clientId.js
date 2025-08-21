import { v4 as uuidv4 } from 'uuid';

export function ensureClientId(req, res, next) {
  const existing = req.cookies?.clientId;
  if (!existing) {
    const id = uuidv4();
    // httpOnly protects from JS access; cookie still sent with requests.
    res.cookie('clientId', id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true if serving over HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    req.clientId = id;
  } else {
    req.clientId = existing;
  }
  next();
}
