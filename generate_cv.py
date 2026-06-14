import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import Color, HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.flowables import Flowable

# ─── Register Fonts ───
pdfmetrics.registerFont(TTFont('Carlito-Bold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Regular', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))

# ─── Colors ───
GREEN = Color(39/255, 139/255, 56/255)   # #278B38 - section headers, lines, links
GRAY = Color(135/255, 130/255, 122/255)   # #87827A - subtitle, contact
BLACK = Color(36/255, 35/255, 32/255)     # #242320 - body text
WHITE = Color(1, 1, 1)

# ─── Page Setup ───
PAGE_W, PAGE_H = A4
LEFT_MARGIN = 60
RIGHT_MARGIN = 60
TOP_MARGIN = 50
BOTTOM_MARGIN = 50
CONTENT_W = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN

# ─── Paragraph Styles ───
style_name = ParagraphStyle(
    'Name', fontName='Carlito-Bold', fontSize=22, textColor=GREEN,
    alignment=TA_CENTER, spaceAfter=4, leading=26
)
style_subtitle = ParagraphStyle(
    'Subtitle', fontName='Carlito-Regular', fontSize=10, textColor=GRAY,
    alignment=TA_CENTER, spaceAfter=3, leading=13
)
style_contact = ParagraphStyle(
    'Contact', fontName='LiberationSerif', fontSize=9.5, textColor=GRAY,
    alignment=TA_CENTER, spaceAfter=2, leading=12
)
style_link = ParagraphStyle(
    'Link', fontName='LiberationSerif', fontSize=9.5, textColor=GREEN,
    alignment=TA_CENTER, spaceAfter=2, leading=12
)
style_section_header = ParagraphStyle(
    'SectionHeader', fontName='Carlito-Bold', fontSize=13, textColor=GREEN,
    spaceAfter=2, spaceBefore=10, leading=16
)
style_body = ParagraphStyle(
    'Body', fontName='LiberationSerif', fontSize=10.5, textColor=BLACK,
    spaceAfter=2, leading=14
)
style_body_bold = ParagraphStyle(
    'BodyBold', fontName='LiberationSerif-Bold', fontSize=10.5, textColor=BLACK,
    spaceAfter=2, leading=14
)
style_label = ParagraphStyle(
    'Label', fontName='LiberationSerif-Bold', fontSize=10.5, textColor=BLACK,
    spaceAfter=2, leading=14
)
style_value = ParagraphStyle(
    'Value', fontName='LiberationSerif', fontSize=10.5, textColor=BLACK,
    spaceAfter=2, leading=14
)
style_bullet = ParagraphStyle(
    'Bullet', fontName='LiberationSerif', fontSize=10.5, textColor=BLACK,
    leftIndent=18, spaceAfter=2, leading=14, bulletIndent=6,
    bulletFontName='Helvetica', bulletFontSize=10
)
style_job_title = ParagraphStyle(
    'JobTitle', fontName='Carlito-Bold', fontSize=11, textColor=BLACK,
    spaceAfter=1, leading=14
)
style_date = ParagraphStyle(
    'Date', fontName='LiberationSerif', fontSize=10, textColor=GREEN,
    spaceAfter=4, leading=13
)
style_website_link = ParagraphStyle(
    'WebsiteLink', fontName='LiberationSerif', fontSize=9.5, textColor=GREEN,
    leftIndent=18, spaceAfter=2, leading=13, bulletIndent=6,
    bulletFontName='Helvetica', bulletFontSize=10
)

# ─── Helper: Green Divider Line ───
def green_line(width=1.2):
    return HRFlowable(
        width="100%", thickness=width, color=GREEN,
        spaceBefore=0, spaceAfter=8
    )

# ─── Helper: Section with header + line ───
def section(title):
    return [
        Paragraph(title, style_section_header),
        green_line(1.2),
    ]

# ─── Helper: Bullet item ───
def bullet(text):
    return Paragraph(f'<bullet>&bull;</bullet> {text}', style_bullet)

# ─── Helper: Key-Value row (for Personal Info and Technical Skills) ───
def kv_table(data, col_widths=None):
    if col_widths is None:
        col_widths = [100, CONTENT_W - 100]
    rows = []
    for key, value in data:
        rows.append([
            Paragraph(key, style_label),
            Paragraph(value, style_value),
        ])
    t = Table(rows, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (0, -1), 0),
        ('LEFTPADDING', (1, 0), (1, -1), 4),
    ]))
    return t

# ─── Build Story ───
story = []

# ═══ PAGE 1 ═══

# Name
story.append(Spacer(1, 8))
story.append(Paragraph('Mohamed Usman Mohamed Milas', style_name))
story.append(Paragraph('Freelance Web Designer &amp; Developer', style_subtitle))
story.append(Spacer(1, 3))
story.append(Paragraph(
    '+94 77 919 4083  |  mohamadusman200@gmail.com  |  Veyangoda, Gampaha, Sri Lanka',
    style_contact
))

# Portfolio link
story.append(Paragraph(
    '<a href="https://portfolio-usman-milas.vercel.app/" color="#278B38">https://portfolio-usman-milas.vercel.app/</a>',
    style_link
))

# Website Projects links
story.append(Spacer(1, 2))
website_links = [
    ('WebWorks', 'https://webworks-amazing-site.webflow.io/'),
    ('Web Works Portfolio', 'https://web-works-portfolio.webflow.io/'),
    ('Giros', 'https://giros-dandy-site-209cb8.webflow.io/'),
]
for name, url in website_links:
    story.append(Paragraph(
        f'<bullet>&bull;</bullet> <a href="{url}" color="#278B38">{name} - {url}</a>',
        style_website_link
    ))

# Divider
story.append(Spacer(1, 4))
story.append(green_line(1.5))

# Personal Information
story.extend(section('Personal Information'))
story.append(kv_table([
    ('Full Name', 'Mohamed Usman Mohamed Milas'),
    ('Preferred Name', 'Usman'),
    ('Date of Birth', '10th September 2004'),
    ('Gender', 'Male'),
    ('Nationality', 'Sri Lankan'),
    ('Address', '45, Kahatowita, Veyangoda, Gampaha, Sri Lanka'),
]))

# Summary
story.extend(section('Summary'))
story.append(Paragraph(
    'Motivated and adaptable individual with a strong foundation in computing, creative design, and problem-solving. '
    'Skilled in programming, digital media production, and collaboration, with a passion for creating effective and '
    'user-friendly digital solutions. Dedicated to continuous learning and applying innovative ideas in both technical '
    'and creative fields. I believe continuous learning is essential in the technology industry, so I actively stay updated '
    'with modern tools, AI driven workflows, and emerging development trends to continuously improve my skills '
    'and adapt to industry changes.',
    style_body
))

# Languages
story.extend(section('Languages'))
story.append(bullet('Sinhala - Native'))
story.append(bullet('Tamil - Native'))
story.append(bullet('English - Intermediate'))

# Core Skills
story.extend(section('Core Skills'))
story.append(bullet('Team Collaboration'))
story.append(bullet('Communication'))
story.append(bullet('Leadership'))
story.append(bullet('Coordination'))
story.append(bullet('Media &amp; Digital Design Creativity'))
story.append(bullet('Adaptability'))
story.append(bullet('Flexibility'))
story.append(bullet('Time Management'))
story.append(bullet('Critical Thinking'))
story.append(bullet('Problem Solving'))

# ═══ PAGE 2 ═══
story.append(PageBreak())

# Technical Skills
story.extend(section('Technical Skills'))
story.append(kv_table([
    ('Programming', 'HTML, Python, PHP, JavaScript (Visual Studio, VS Code)'),
    ('Database', 'MySQL, XAMPP'),
    ('Software', 'Microsoft Word, Excel, PowerPoint'),
    ('Creative Tools', 'Photo Editing, Media Production, Digital Design'),
    ('Web Platforms', 'WordPress, Webflow'),
]))

# Professional Experience
story.extend(section('Professional Experience'))

story.append(Paragraph('Assistant Web Designer &amp; Developer', style_job_title))
story.append(Paragraph('2022 - 2024 | Remote Collaboration with Senior Web Designer &amp; Developer', style_date))
story.append(bullet(
    'Worked alongside a <b>senior professional web designer and developer</b> with a strong international freelance '
    'client base for <b>3 years</b>.'
))
story.append(bullet(
    'Earned <b>$2,000 - $3,000 per month</b> through consistent delivery of high-quality web design and '
    'services to international clients.'
))
story.append(bullet(
    'Assisted in designing and developing modern, responsive websites using HTML, PHP, JavaScript, '
    'WordPress, and Webflow.'
))
story.append(bullet(
    'Collaborated on real client projects, improving UI/UX design, website structure, and performance '
    'optimization.'
))
story.append(bullet(
    'Gained hands-on experience in professional web development workflows, client communication, and project '
    'coordination.'
))

story.append(Spacer(1, 10))
story.append(Paragraph('Freelance Web Designer', style_job_title))
story.append(Paragraph('2022 - 2024 | Self-Employed', style_date))
story.append(bullet('Designed and developed responsive websites tailored to client requirements.'))
story.append(bullet('Applied creative digital design techniques to enhance user experience.'))
story.append(bullet('Managed full-cycle projects including planning, coding, testing, and delivery.'))

# Education
story.extend(section('Education'))
story.append(Paragraph('Al Badriya Maha Vidyalaya, Kahatowita', style_job_title))
story.append(Paragraph('2010 - 2023', style_date))
story.append(bullet('Successfully completed Advanced Level education.'))
story.append(bullet('Focused on Information Technology, Art, and Sinhala.'))

# Professional Qualifications
story.extend(section('Professional Qualifications'))
story.append(Paragraph('British Way English Academy', style_job_title))
story.append(Paragraph('2022', style_date))
story.append(bullet('Successfully completed English language training.'))

story.append(Spacer(1, 10))
story.append(Paragraph('ESOFT University, Colombo 04', style_job_title))
story.append(Paragraph('2025', style_date))
story.append(bullet('Reading: Pearson Assured (UK) RQF Level 4 - Higher National Certificate (HNC) in Computing.'))

# Declaration
story.extend(section('Declaration'))
story.append(Paragraph(
    'I hereby declare that the information provided above is true and accurate to the best of my knowledge. I '
    'understand that any misrepresentation may lead to disqualification from consideration.',
    style_body
))

# ─── Build PDF ───
output_path = '/home/z/my-project/download/Usman_CV.pdf'
os.makedirs(os.path.dirname(output_path), exist_ok=True)

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=LEFT_MARGIN,
    rightMargin=RIGHT_MARGIN,
    topMargin=TOP_MARGIN,
    bottomMargin=BOTTOM_MARGIN,
)

doc.build(story)
print(f"CV generated at: {output_path}")
