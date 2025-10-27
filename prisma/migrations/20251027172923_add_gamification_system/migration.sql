-- CreateTable
CREATE TABLE "user_game_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "current_xp" INTEGER NOT NULL DEFAULT 0,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_game_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_game_profiles_user_id_key" ON "user_game_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_game_profiles_user_id_idx" ON "user_game_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "user_game_profiles" ADD CONSTRAINT "user_game_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
