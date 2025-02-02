export function generateVerificationEmailContent({
  userName,
  token,
  ttl,
  appName,
  appUrl,
}) {
  const verificationLink = `${appUrl}/verify-account?token=${token}`;
  const subject = `Xác minh tài khoản ${appName} của bạn`;

  const html = `
    <div style="background-color: #f4f4f4; padding: 40px 6px; font-family: 'Arial', sans-serif;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px 40px; border-radius: 8px;">
    
            <div style="margin-bottom: 20px; text-align: left;">
                <div style="display: inline-block; vertical-align: middle;">
                    <img src="https://vinaedu.id.vn/favicon.png" alt="${appName} Logo" style="width: 40px; height: 40px; margin-right: 10px; object-fit: contain; vertical-align: middle;">
                </div>
                <div style="display: inline-block; vertical-align: middle;">
                    <p style="font-size: 18px; color: #333; font-weight: bold; margin: 0; display: inline-block; vertical-align: middle;">${appName}</p>
                </div>
            </div>
    
            <p style="font-size: 16px; color: #333; line-height: 1.5;">Chào ${userName || 'bạn'},</p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Cảm ơn bạn đã đăng ký tài khoản tại <strong>${appName}</strong>. Để hoàn tất quá trình đăng ký, vui lòng xác
                minh tài khoản của bạn bằng cách nhấn vào liên kết dưới đây trong vòng ${ttl} phút:
            </p>
    
            <div style="text-align: center; margin-top: 30px;">
                <a href="${verificationLink}" target="_blank"
                    style="background-color: #0072ff; color: #ffffff; padding: 10px 50px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 4px; display: inline-block;">Xác
                    minh tài khoản</a>
            </div>
    
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-top: 70px; text-align: center;">
                Nếu bạn không yêu cầu xác minh tài khoản, vui lòng bỏ qua email này.
            </p>
    
            <div style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
                <p>Bản quyền © 2024 VinaEdu. Bảo lưu mọi quyền.</p>
            </div>
        </div>
    </div>
  `;

  const text = `
    Chào ${userName || 'bạn'},

    Cảm ơn bạn đã đăng ký tài khoản tại ${appName}. Để hoàn tất quá trình đăng ký, vui lòng xác minh tài khoản của bạn bằng cách nhấn vào liên kết dưới đây trong vòng ${ttl} phút:

    ${verificationLink}

    Nếu bạn không yêu cầu xác minh tài khoản, vui lòng bỏ qua email này.

    Bản quyền © 2024 ${appName}. Bảo lưu mọi quyền.`;

  return { subject, text, html };
}
