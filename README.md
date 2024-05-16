# nextjs-admin-shadcn

[中文版本](./README.zh.md)

## Introduction

`nextjs-admin-shadcn` is a backend management system built with Next.js and Shadcn. 

## Tech Stack

- **Next.js 14**: Framework for building server-rendered React applications.
- **Shadcn-UI**: UI components library.
- **Next-auth v5**: Authentication library for Next.js.
- **Drizzle**: ORM for database management.
- **Resend**: Service for sending emails.
- **Uploadthing**: Service for image uploads.

## Features

- **Sidebar**
- **System User Management**
  - Three roles: `Super Admin`, `Admin`, `User`
  - Users registered via the registration page are given `Admin` permissions by default and have access to all menus.
  - `Admins` can invite users to register by adding their email and name via the "New User" button.
  - `Admins` can assign menus to users.
  - `Admins` can only see users they have invited or created.
  - `Super Admins` have all permissions.
  - User permissions are assigned by `Admin` or `Super Admin`.
- **System Menu Management**
  - `Admins` can create menus (deletion not currently supported, but you can set delete permissions yourself).
- **Personal Information Management**
  - Upload avatar
  - Change email
  - Set appearance
- **Error Pages**
  - 404 Page
  - 500 Page

