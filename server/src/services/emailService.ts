import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private transporter = transporter

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || 'noreply@saudi-essence.com',
        ...options
      })
      return true
    } catch (error) {
      console.error('Email send error:', error)
      return false
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>أهلا وسهلا بك في Saudi Essence! 🎉</h2>
        <p>السلام عليكم ${name}،</p>
        <p>شكراً لاختيارك Saudi Essence. نحن سعداء بانضمامك إلى عائلتنا.</p>
        <p><strong>حصريات خاصة:</strong></p>
        <ul>
          <li>خصم 10% على أول طلب لك</li>
          <li>عرض شامل على جميع المنتجات</li>
          <li>برنامج نقاط الولاء</li>
        </ul>
        <p>
          <a href="${process.env.CLIENT_URL}/products" style="background: #D4AF37; color: #1a1a1a; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            ابدأ التسوق الآن
          </a>
        </p>
        <p>مع أطيب التمنيات،</p>
        <p><strong>فريق Saudi Essence</strong></p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: 'أهلا وسهلا في Saudi Essence',
      html
    })
  }

  async sendOrderConfirmation(
    email: string,
    orderNumber: string,
    total: number,
    items: any[]
  ): Promise<boolean> {
    const itemsHtml = items
      .map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.price}</td></tr>`)
      .join('')

    const html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>تأكيد طلبك 📦</h2>
        <p>رقم الطلب: <strong>${orderNumber}</strong></p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #D4AF37;">
            <th>المنتج</th>
            <th>الكمية</th>
            <th>السعر</th>
          </tr>
          ${itemsHtml}
        </table>
        <h3>الإجمالي: ${total} ريال</h3>
        <p>سيتم معالجة طلبك قريباً وتسليمه خلال 2-3 أيام عمل.</p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: `تأكيد الطلب #${orderNumber}`,
      html
    })
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

    const html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>إعادة تعيين كلمة المرور</h2>
        <p>لقد طلبت إعادة تعيين كلمة مرورك.</p>
        <p>
          <a href="${resetUrl}" style="background: #D4AF37; color: #1a1a1a; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            إعادة تعيين كلمة المرور
          </a>
        </p>
        <p>إذا لم تطلب هذا، تجاهل هذا البريد.</p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
      html
    })
  }

  async sendShippingNotification(
    email: string,
    orderNumber: string,
    trackingNumber: string
  ): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>تم شحن طلبك! 🚚</h2>
        <p>رقم الطلب: <strong>${orderNumber}</strong></p>
        <p>رقم التتبع: <strong>${trackingNumber}</strong></p>
        <p>
          <a href="${process.env.CLIENT_URL}/orders/${orderNumber}">
            تتبع الطلب
          </a>
        </p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: `شحن الطلب #${orderNumber}`,
      html
    })
  }

  async sendNewsletterEmail(email: string, products: any[]): Promise<boolean> {
    const productsHtml = products
      .slice(0, 5)
      .map(p => `
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd;">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <p style="color: #D4AF37; font-size: 18px; font-weight: bold;">${p.price} ريال</p>
        </div>
      `)
      .join('')

    const html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>الأسبوع الجديد في Saudi Essence ✨</h2>
        <p>منتجات جديدة وعروض حصرية في انتظارك!</p>
        ${productsHtml}
        <p>
          <a href="${process.env.CLIENT_URL}/products">
            تصفح جميع المنتجات
          </a>
        </p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: 'آخر المنتجات والعروض من Saudi Essence',
      html
    })
  }
}

export default new EmailService()
