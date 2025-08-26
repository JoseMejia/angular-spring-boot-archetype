def renameFile(request, dir, origFilename, destFilename) {
    def dirName = request.getOutputDirectory()
    def file = new File(dirName,
            request.getArtifactId() + "/" + dir +  "/" + origFilename
    );
    def destFile = new File(
            dirName,
            request.getArtifactId() + "/" + dir + "/" + destFilename
    );
    file.renameTo(destFile)
}

renameFile(request, ".", "dot.gitignore", ".gitignore")
renameFile(request, "frontend", "dot.gitignore", ".gitignore")