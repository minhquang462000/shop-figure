import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    Req,
    BadRequestException,
    UploadedFile,
    Query,
    ParseArrayPipe,
} from '@nestjs/common'
import { CharacterService } from './character.service'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { storageConfig } from 'src/configs/config-uploadImg'
import { extname } from 'path'
import { create } from 'domain'

@ApiBearerAuth()
@ApiResponse({ status: 201, description: 'Forbidden' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('api/v1/characters')
export class CharacterController {
    constructor(private readonly characterService: CharacterService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: storageConfig('character'),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname)
                const allowedExtArr = ['.png', '.jpg', '.jpeg']
                if (!allowedExtArr.includes(ext)) {
                    req.fileValidationError = `Only images are :${allowedExtArr.toString()} `
                    return cb(null, false)
                }
                const fileSize = parseInt(req.headers['content-length'])
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError =
                        'File size is too large. Acceptable size is 5MB'
                    return cb(null, false)
                }
                return cb(null, true)
            },
        })
    )
    create(
        @Req() req: any,
        @Body() CreateCharacterDto: CreateCharacterDto,
        @UploadedFile() thumbnail: Express.Multer.File
    ) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }
        if (thumbnail) {
            CreateCharacterDto.thumbnail =
                'character' + '/' + thumbnail.filename
        }
        return this.characterService.create(CreateCharacterDto)
    }

    @Get()
    findAll(@Query() query: any): Promise<any> {
        return this.characterService.findAll(query)
    }
    @Get('all')
    findAllCharacter():Promise<any> {
       return this.characterService.findAllCharacter();
     }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.characterService.findOne(+id)
    }
  
    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: storageConfig('character'),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname)
                const allowedExtArr = ['.png', '.jpg', '.jpeg']
                if (!allowedExtArr.includes(ext)) {
                    req.fileValidationError = `Only images are :${allowedExtArr.toString()} `
                    return cb(null, false)
                }
                const fileSize = parseInt(req.headers['content-length'])
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError =
                        'File size is too large. Acceptable size is 5MB'
                    return cb(null, false)
                }
                return cb(null, true)
            },
        })
    )
    update(
        @Req() req,
        @Param('id') id: string,
        @Body() updateCharacterDto: any,
        @UploadedFile() thumbnail: Express.Multer.File
    ) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }
        if (thumbnail) {
            updateCharacterDto.thumbnail =
                'character' + '/' + thumbnail.filename
        }
        return this.characterService.update(+id, updateCharacterDto)
    }
    @Delete('multiple')
    multipleDelete(
        @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
        ids: string[]
    ) {
        return this.characterService.multipleDelete(ids)
    }
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.characterService.remove(+id)
    }
}
