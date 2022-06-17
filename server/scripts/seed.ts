import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Salt, parseSalt } from "../src/auth/password.service";
// @ts-ignore

if (require.main === module) {
  dotenv.config();

  const { BCRYPT_SALT } = process.env;

  if (!BCRYPT_SALT) {
    throw new Error("BCRYPT_SALT environment variable must be defined");
  }

  const salt = parseSalt(BCRYPT_SALT);

  seed(salt).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
async function seed(bcryptSalt: Salt) {
  console.info("Seeding database...");

  const client = new PrismaClient();

  const queryEnableRowSecurity =
    'alter table public."User" enable row level security';
  await client.$queryRawUnsafe(queryEnableRowSecurity);

  const queryPolicySelect =
    'create policy "Public users are viewable by everyone." on public."User" for select using ( true )';
  await client.$queryRawUnsafe(queryPolicySelect);

  const queryAlterIdType =
    'alter table public."User" alter column id SET DATA type uuid USING (uuid_generate_v4())';
  await client.$queryRawUnsafe(queryAlterIdType);

  const queryPolicyInsert =
    'create policy "Users can insert their own users." on public."User" for insert with check ( auth.uid() = id )';
  await client.$queryRawUnsafe(queryPolicyInsert);

  const queryPolicyupdate =
    'create policy "Users can update own users." on public."User" for update using ( auth.uid() = id )';
  await client.$queryRawUnsafe(queryPolicyupdate);

  const queryPolicySelectId =
    'create policy "Users are viewable by users who created them." on public."User" for select using ( auth.uid() = id )';
  await client.$queryRawUnsafe(queryPolicySelectId);

  // create function that insert new row into  public.User
  const queryFunctionAddUser =
    "create function public.handle_new_user() " +
    "returns trigger " +
    "language plpgsql " +
    "security definer set search_path = public " +
    "as $$ " +
    "begin " +
    'insert into public."User" (id,"createdAt","updatedAt",username,password,roles) ' +
    "values (new.id,new.created_at,new.updated_at,new.email,new.encrypted_password, ARRAY[new.role]) " +
    "ON CONFLICT (id) " +
    "DO " +
    'UPDATE SET "createdAt" = new.created_at,"updatedAt" = new.updated_at,username = new.email, ' +
    "password = new.encrypted_password,roles = ARRAY[new.role]; " +
    "return new; " +
    "end; " +
    "$$; ";
  await client.$queryRawUnsafe(queryFunctionAddUser);

  // create function that delete user when delete row from auth.user
  const queryFunctionDeleteUser =
    "create function public.handle_delete_user() " +
    "returns trigger " +
    "language plpgsql " +
    "security definer set search_path = public " +
    "as $$ " +
    "begin " +
    'delete from public."User" where id = old.id; ' +
    "return old; " +
    "end; " +
    "$$; ";
  await client.$queryRawUnsafe(queryFunctionDeleteUser);

  const queryTriggerAddUser =
    "create trigger on_auth_user_created " +
    "after insert or update on auth.users " +
    "for each row execute procedure public.handle_new_user() ";

  await client.$queryRawUnsafe(queryTriggerAddUser);

  const queryTriggerDeleteUser =
    "create trigger on_auth_user_deleted " +
    "after delete on auth.users " +
    "for each row execute procedure public.handle_delete_user() ";

  await client.$queryRawUnsafe(queryTriggerDeleteUser);

  client.$disconnect();

  console.info("Seeding database with custom seed...");
  console.info("Seeded database successfully");
}
