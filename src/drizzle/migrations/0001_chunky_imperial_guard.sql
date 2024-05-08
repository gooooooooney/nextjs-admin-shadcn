CREATE TABLE IF NOT EXISTS "user_menu" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"menu_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_roleId_Role_id_fk";
--> statement-breakpoint
ALTER TABLE "Menu" DROP COLUMN IF EXISTS "roleId";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_menu" ADD CONSTRAINT "user_menu_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_menu" ADD CONSTRAINT "user_menu_menu_id_Menu_id_fk" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
